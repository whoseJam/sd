#include<algorithm>
#include<iostream>
#include<cstring>
using namespace std;

const int N=100005;
int n,m,c[N];

int lowbit(int x){
	return x&(-x);
}

void add(int x,int d){
	for(int i=x;i<=n;i+=lowbit(i))
		c[i]+=d;
}

int sum(int x){
	int ans=0;
	for(int i=x;i>0;i-=lowbit(i))
		ans+=c[i];
	return ans;
}

int main(){
    cin>>n>>m;
    for(int i=1,opt,x,y;i<=m;i++){
        cin>>opt;
        if(opt==1){
            cin>>x>>y;
            add(x,1);
            add(y+1,-1);
        }else{
            cin>>x;
            cout<<sum(x)<<"\n";
        }
    }
    return 0;
}
