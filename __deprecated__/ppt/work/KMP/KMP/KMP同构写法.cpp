#include<functional>
#include<iostream>
#include<cstring>
using namespace std;
const int N=1000005;
int len[N],n,m;
char s1[N];
char s2[N];

void Match(char *s,char* t,int start,int ls,int lt,function<void(int,int)> callback){
	int j=0;
	for(int i=start;i<=n;i++){
		while(t[j+1]!=s[i]&&j)j=len[j];
		if(t[j+1]==s[i])j++;
		callback(i,j);
	}
} 

int main(){
	scanf("%s",s1+1);
	scanf("%s",s2+1);
	n=strlen(s1+1);
	m=strlen(s2+1);
	Match(s2,s2,2,m,m,[](int i,int j){
		len[i]=j;
	});
	Match(s1,s2,1,n,m,[](int i,int j){
		if(j==m)cout<<i-m+1<<'\n';
	});
	for(int i=1;i<=m;i++)
		cout<<len[i]<<' ';
	return 0;
}