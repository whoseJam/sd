#include<bits/stdc++.h>
#define lc (x<<1)
#define rc (x<<1|1)
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=100005;
int n,q;

struct Node{
	int x,y;
	void output(){
		cout<<"("<<x<<","<<y<<")";
	}
}p[N];

int Dis(Node a,Node b){
	return abs(a.x-b.x)+abs(a.y-b.y);
}

struct info{
	int dis;
	int len;
	int shortcut;
	Node L,L0,R,R0;
	void init(Node x){
		L=L0=R=R0=x;
		dis=shortcut=0;
		len=1;
	}
};

info Merge(info a,info b){
	info ans;
	ans.L=a.L;if(a.len>1)ans.L0=a.L0;else ans.L0=b.L;
	ans.R=b.R;if(b.len>1)ans.R0=b.R0;else ans.R0=a.R;
	ans.len=a.len+b.len;
	ans.dis=a.dis+Dis(a.R,b.L)+b.dis;
	ans.shortcut=max(a.shortcut,b.shortcut);
	ans.shortcut=max(Dis(a.R0,a.R)+Dis(a.R,b.L)-Dis(a.R0,b.L),ans.shortcut); 
	// a[R0] -> a[R] -> b[L] -> b[L0]		a[R0] -> b[L] -> b[L0]
	ans.shortcut=max(Dis(a.R,b.L)+Dis(b.L,b.L0)-Dis(a.R,b.L0),ans.shortcut);
	// a[R0] -> a[R] -> b[L] -> b[L0]		a[R0] -> a[R] -> b[L0]
	return ans;// a[L L0 ... R0 R] b[L L0 ... R R0]
}

struct seg{
	int l,r;
	info sum;
}t[N*4];

void pushUp(int x){
	t[x].sum=Merge(t[lc].sum,t[rc].sum);
}

void Build(int x,int l,int r){
	t[x].l=l;t[x].r=r;
	if(l==r){t[x].sum.init(p[l]);return;}
	int mid=(l+r)>>1;
	Build(lc,l,mid);
	Build(rc,mid+1,r);
	pushUp(x);
} 

info Ask(int x,int l,int r){
	if(l<=t[x].l&&t[x].r<=r)
		return t[x].sum;
	int mid=(t[x].l+t[x].r)>>1;
	if(r<=mid)return Ask(lc,l,r);
	if(l>mid)return Ask(rc,l,r);
	return Merge(Ask(lc,l,r),Ask(rc,l,r));
}

void Update(int x,int pos,Node d){
	if(t[x].l==t[x].r){
		t[x].sum.init(d);
		return;
	}
	int mid=(t[x].l+t[x].r)>>1;
	if(pos<=mid)Update(lc,pos,d);
	else Update(rc,pos,d);
	pushUp(x);
}

int main(){
	n=read();q=read();
	for(int i=1;i<=n;i++){
		p[i].x=read();
		p[i].y=read();
	}
	Build(1,1,n);
	char opt[3];
	for(int i=1;i<=q;i++){
		scanf("%s",opt);
		if(opt[0]=='U'){
			int pos=read();
			Node d;
			d.x=read();d.y=read();
			Update(1,pos,d);
		}else{
			int l=read(),r=read();
			info ans=Ask(1,l,r);
			cout<<ans.dis-ans.shortcut<<'\n';
		}
	}
	return 0;
}

